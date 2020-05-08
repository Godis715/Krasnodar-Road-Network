#pragma once
#include <iostream>
#include <fstream>
#include <limits>
#include <vector>
#include <stack>
#include <queue>

using int_pair = std::pair<size_t, size_t>;
using i_f_pair = std::pair<size_t, double>;
using float_pair = std::pair<double, double>;
using std::vector;

//graph
// vector<size_t> fixed_objects; // firestations, hospitals, burger kings
// vector<size_t> no_fixed_objects; // homes
constexpr size_t infinty = std::numeric_limits<size_t>::max();
constexpr double double_infinty = std::numeric_limits<double>::max();

template <class t>
inline t max_value(const t a, const t b)
{
	return a > b ? a : b;
}

template <class t>
inline t min_value(const t a, const t b)
{
	return a < b ? a : b;
}

struct graph_t
{
	vector<vector<i_f_pair>> edges; // vertex; distance
	vector<vector<i_f_pair>> r_edges;
	vector<float_pair> coords;
	size_t size;
};
//

inline vector<double> dijkstra(const vector<vector<i_f_pair>>& graph, const size_t start)
{
	size_t n = graph.size();

	vector<double> distance(n, double(infinty) + 1);
	auto f = [](i_f_pair x, i_f_pair y)
	{
		return x.second > y.second;
	};
	std::priority_queue<i_f_pair, vector<i_f_pair>, decltype(f)> q(f);
	// vertex; distance
	q.push({ start, 0 });

	while (!q.empty())
	{
		auto vertex = q.top();
		size_t v = vertex.first;
		q.pop();
		if (distance[v] < infinty) // vertex already used
			continue;
		distance[v] = vertex.second;
		for (auto& u : graph[v])
			if (distance[u.first] > infinty)
				q.push({ u.first, vertex.second + u.second });
	}
	return distance;
}

inline vector<double> dijkstra_fast(const vector<vector<i_f_pair>>& graph,
	const size_t start, const vector<size_t>& objects)
{
	size_t n = graph.size();
	size_t is_not_end = objects.size();

	vector<char> checker(n, 0);
	for (size_t obj : objects)
		checker[obj] = 1;
	vector<double> distance(n, double(infinty) + 1); // from, dist
	auto f = [](i_f_pair x, i_f_pair y)
	{
		return x.second > y.second;
	};
	std::priority_queue<i_f_pair, vector<i_f_pair>, decltype(f)> q(f);
	// vertex; distance
	q.push({ start, 0 });

	while (!q.empty() && is_not_end)
	{
		auto vertex = q.top();
		size_t v = vertex.first;
		q.pop();
		if (distance[v] < infinty) // vertex already used
			continue;
		if (checker[v])
			--is_not_end;
		distance[v] = vertex.second;
		for (auto& u : graph[v])
			if (distance[u.first] > infinty)
				q.push({ u.first, vertex.second + u.second });
	}
	return distance;
}

inline vector<i_f_pair> dijkstra_path(const vector<vector<i_f_pair>>& graph, const size_t start)
{
	size_t n = graph.size();

	vector<i_f_pair> distance(n, i_f_pair(infinty, infinty)); // from, dist
	auto f = [](std::pair<int_pair, double> x, std::pair<int_pair, double> y)
	{
		return x.second > y.second;
	};
	std::priority_queue<std::pair<int_pair, double>, vector<std::pair<int_pair, double>>, decltype(f)> q(f);
	// vertex(from, to); distance
	q.push({ {start, start}, 0 });
	//size_t c = 0;
	while (!q.empty())
	{
		auto vertex = q.top();
		size_t v = vertex.first.second;
		q.pop();
		if (distance[v].second < infinty) // vertex already used
			continue;

		distance[v] = i_f_pair(vertex.first.first, vertex.second);
		for (auto& u : graph[v])
			if (distance[u.first].second == infinty)
				q.push({ {v, u.first}, vertex.second + u.second });
		//++c;
	}
	//std::cout << c << std::endl;
	return distance;
}


inline vector<i_f_pair> dijkstra_path_fast(const vector<vector<i_f_pair>>& graph,
	const size_t start, const vector<size_t>& objects)
{
	size_t n = graph.size();
	size_t is_not_end = objects.size();

	vector<char> checker(n, 0);
	for (size_t obj : objects)
		checker[obj] = 1;
	vector<i_f_pair> distance(n, i_f_pair(infinty, infinty)); // from, dist
	auto f = [](std::pair<int_pair, double> x, std::pair<int_pair, double> y)
	{return x.second > y.second; };

	std::priority_queue<std::pair<int_pair, double>, vector<std::pair<int_pair, double>>, decltype(f)> q(f);
	// vertex(from, to); distance
	q.push({ {start, start}, 0 });

	while (!q.empty() && is_not_end)
	{
		auto vertex = q.top();
		size_t v = vertex.first.second;
		q.pop();
		if (distance[v].second < infinty) // vertex already used
			continue;
		if (checker[v])
			--is_not_end;
		distance[v] = i_f_pair(vertex.first.first, vertex.second);
		for (auto& u : graph[v])
			if (distance[u.first].second == infinty)
				q.push({ {v, u.first}, vertex.second + u.second });
	}
	return distance;
}

inline vector<vector<int>> floyd() // matrix smezhnosty (-1 : path doesnt exist)
{
	// reading
	size_t n;
	std::cin >> n;
	vector<vector<int>> matrix(n, vector<int>(n));
	for (size_t i = 0; i < n; ++i)
		for (size_t j = 0; j < n; ++j)
			std::cin >> matrix[i][j];
	//

	for (size_t k = 0; k < n; ++k)
		for (size_t i = 0; i < n; ++i)
			for (size_t j = 0; j < n; ++j)
				matrix[i][j] = min_value(matrix[i][j], matrix[i][k] + matrix[k][j]);
	return matrix;
}

inline graph_t read_data(const char* file_name)
{
	size_t n, e;
	std::ifstream in(file_name);
	in >> n >> e;
	graph_t graph;
	graph.size = n;
	graph.edges = vector<vector<i_f_pair>>(n);
	graph.coords = vector<float_pair>(n);
	for (size_t i = 0; i < e; ++i)
	{
		size_t v, u;
		double d;
		in >> v >> u >> d;
		graph.edges[v].push_back({ u, d });
	}
	for (size_t i = 0; i < n; ++i)
	{
		double x, y;
		in >> x >> y;
		graph.coords[i] = { x, y };
	}
	in.close();
	return graph;
}

inline void reverse_graph(graph_t& graph)
{
	graph.r_edges = vector<vector<i_f_pair>>(graph.size);
	for (size_t i = 0; i < graph.size; ++i)
		for (size_t j = 0; j < graph.edges[i].size(); ++j)
			graph.r_edges[graph.edges[i][j].first].push_back({ i, graph.edges[i][j].second });
}

inline double weight_tree_of_shortest_path(const vector<i_f_pair>& distance, vector<size_t> objects)
{
	vector<char> used(distance.size(), 0);
	double weight = 0;
	std::stack<size_t> stack;
	for (size_t v : objects)
		if (distance[v].first != infinty)
			stack.push(v);
	while (!stack.empty())
	{
		size_t v = stack.top();
		stack.pop();
		if (used[v])
			continue;
		used[v] = 1;

		if (distance[v].first != v)
		{
			weight += distance[v].second - distance[distance[v].first].second;
			stack.push(distance[v].first);
		}
	}
	return weight;
}

//inline vector<int_pair> tree_of_shortest_path(const vector<i_f_pair>& distance, vector<size_t> objects)
//{
//	vector<int_pair> tree;
//	vector<bool> used(distance.size(), false);
//	std::stack<size_t> stack;
//	for (size_t v : objects)
//		stack.push(v);
//	while (!stack.empty())
//	{
//		size_t v = stack.top();
//		stack.pop();
//		if (used[v])
//			continue;
//
//		used[v] = true;
//		if (distance[v].first != infinty && distance[v].first != v)
//		{
//			stack.push(distance[v].first);
//			tree.push_back({ distance[v].first , v });
//		}
//	}
//	return tree;
//}

inline std::pair<vector<int_pair>, float_pair> tree_of_shortest_path(const vector<i_f_pair>& distance, vector<size_t> objects)
{
	vector<char> used(distance.size(), 0);
	double weight = 0;
	double lenght_path = 0;
	vector<int_pair> tree;
	std::stack<size_t> stack;
	for (size_t v : objects)
		if (distance[v].first != infinty)
		{
			stack.push(v);
			lenght_path += distance[v].second;
		}
	while (!stack.empty())
	{
		size_t v = stack.top();
		stack.pop();
		if (used[v])
			continue;

		used[v] = 1;

		if (distance[v].first != v)
		{
			weight += distance[v].second - distance[distance[v].first].second;
			stack.push(distance[v].first);
			tree.push_back({ distance[v].first , v });
		}
	}
	return std::pair<vector<int_pair>, float_pair>(tree, { weight, lenght_path });
}

inline double dist(float_pair l, float_pair r)
{
	return (l.first - r.first) * (l.first - r.first) + (l.second - r.second) * (l.second - r.second);
}
inline size_t get_nearest_vertex(float_pair vec, const graph_t& graph)
{
	double distance = std::numeric_limits<double>::max();
	size_t res = 0;
	for (size_t i = 0; i < graph.size; ++i)
	{
		double cur_dist = dist(vec, graph.coords[i]);
		if (distance > cur_dist)
		{
			distance = cur_dist;
			res = i;
		}
	}
	return res;
}

inline float_pair operator*(float_pair l, float_pair r)
{
	return float_pair(l.first * r.first, l.second * r.second);
}
inline float_pair operator+(float_pair l, float_pair r)
{
	return float_pair(l.first + r.first, l.second + r.second);
}
inline float_pair operator/(float_pair p, double d)
{
	return float_pair(p.first / d, p.second / d);
}
inline float_pair operator*(float_pair p, double d)
{
	return float_pair(p.first * d, p.second * d);
}

inline int_pair nearest_clusters(const vector<float_pair>& centroides)
{
	double min = std::numeric_limits<double>::max();
	int_pair res;
	for (size_t i = 0; i < centroides.size(); ++i)
		if (centroides[i].first > 0)
			for (size_t j = i + 1; j < centroides.size(); ++j)
			{
				if (centroides[j].first < 0)
					continue;
				double cur = dist(centroides[i], centroides[j]);
				if (cur < min)
				{
					min = cur;
					res.first = i;
					res.second = j;
				}
			}
	return res;
}

inline vector<size_t> get_centroids(const vector<float_pair>& centroides, const graph_t& graph)
{
	vector<size_t> res(centroides.size(), 0);
	for (size_t i = 0; i < centroides.size(); ++i)
		res[i] = get_nearest_vertex(centroides[i], graph);
	return res;
}

// for centroide wiit negative (<0)amount 
inline vector<size_t> get_centroids_with_invalid(const vector<float_pair>& centroides, const graph_t& graph)
{
	vector<size_t> res;
	for (size_t i = 0; i < centroides.size(); ++i)
		if (centroides[i].first > 0)
			res.push_back(get_nearest_vertex(centroides[i], graph));
	return res;
}

inline auto clustering(size_t k, const vector<size_t>& no_fixed_objects, const graph_t& graph)
{
	vector<vector<size_t>> clusters(no_fixed_objects.size(), vector<size_t>(1));
	vector<float_pair> centroids(no_fixed_objects.size());

	for (size_t i = 0; i < no_fixed_objects.size(); ++i)
	{
		clusters[i][0] = no_fixed_objects[i];
		centroids[i] = graph.coords[no_fixed_objects[i]];
	}

	while (clusters.size() > k)
	{
		auto pair = nearest_clusters(centroids);
		centroids[pair.first] = (centroids[pair.first] * clusters[pair.first].size() +
			centroids[pair.second] * clusters[pair.second].size()) / (clusters[pair.first].size() + clusters[pair.second].size());

		clusters[pair.first].insert(clusters[pair.first].end(), clusters[pair.second].begin(), clusters[pair.second].end());

		clusters.erase(clusters.begin() + pair.second);
		centroids.erase(centroids.begin() + pair.second);
	}
	return std::pair<vector<vector<size_t>>, vector<float_pair>>(clusters, centroids);
}

inline void clustering(size_t k, const vector<size_t>& no_fixed_objects,
	const graph_t& graph, const char* out_file)
{
	vector<vector<size_t>> clusters(no_fixed_objects.size(), vector<size_t>(1));
	vector<vector<int_pair>> dendrogramma(no_fixed_objects.size());
	vector<float_pair> centroids(no_fixed_objects.size());

	for (size_t i = 0; i < no_fixed_objects.size(); ++i)
	{
		clusters[i][0] = no_fixed_objects[i];
		centroids[i] = graph.coords[no_fixed_objects[i]];
	}
	size_t height_merge = 1;
	for (size_t i = k; i < clusters.size(); ++i)
	{
		auto pair = nearest_clusters(centroids);
		centroids[pair.first] = (centroids[pair.first] * clusters[pair.first].size() +
			centroids[pair.second] * clusters[pair.second].size()) / (clusters[pair.first].size() + clusters[pair.second].size());

		clusters[pair.first].insert(clusters[pair.first].end(), clusters[pair.second].begin(), clusters[pair.second].end());


		clusters[pair.second].clear();
		centroids[pair.second] = { -1.0, -1.0 };
		dendrogramma[pair.first].push_back({ pair.second, height_merge });
		++height_merge;
	}
	auto centroids_object = get_centroids_with_invalid(centroids, graph);
	std::ofstream out(out_file);
	out << k << std::endl;
	for (auto& cluster : clusters)
		if (cluster.size() != 0)
		{
			out << cluster.size() << ' ';
			for (size_t v : cluster)
				out << v << ' ';
			out << std::endl;
		}

	for (size_t center : centroids_object)
		out << center << ' ';
	out << std::endl;
	out.setf(std::ios::fixed);
	out.precision(8);
	for (float_pair center : centroids)
		if (center.first > 0)
			out << center.first << ' ' << center.first << std::endl;
	out << std::endl;
	for (size_t i = 0; i < dendrogramma.size(); ++i)
		if (dendrogramma[i].size() != 0) {
			out << i << ' ';
			for (int_pair who_step : dendrogramma[i])
				out << who_step.first << ' ' << who_step.second << ' ';
			out << std::endl;
		}
	out.close();
}
