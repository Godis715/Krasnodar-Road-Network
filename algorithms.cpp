using namespace std;
#include <iostream>
#include <fstream>
#include <vector>
#include <stack>
#include <queue>

//graph
vector<vector<pair<size_t, size_t>>> outgoingEdges; // // vertex; distance
vector<vector<int>> matrix; // matrix smezhnosty (-1 : path doesnt exist)
vector<size_t> fixed_objects; // firestations, hospitals, burger kings
vector<size_t> no_fixed_objects; // firestations, hospitals, burger kings
size_t infinty = std::numeric_limits<size_t>::max();
//

vector<size_t> dijkstra(const size_t start)
{
	size_t n = outgoingEdges.size();

	vector<size_t> distance(n, infinty);
	auto f = [](pair<size_t, size_t> x, pair<size_t, size_t> y)
	{
		return x.first > y.first;
	};
	std::priority_queue<pair<size_t, size_t>, vector<pair<size_t, size_t>>, decltype(f)> q(f);
	// vertex; distance
	q.push({ start, 0 });

	while (!q.empty())
	{
		auto vertex = q.top();
		q.pop();
		if (distance[vertex.first] < infinty) // vertex already used
			continue;
		distance[vertex.first] = vertex.second;
		for (auto& u : outgoingEdges[vertex.first])
			if (distance[u.first] == infinty)
				q.push({ u.second, vertex.second + u.second });
	}
	//for (int d : distance)
	//	cout << d << " ";
	return distance;
}

void floyd()
{
	// reading
	size_t n;
	cin >> n;
	vector<vector<int>> matrix(n, vector<int>(n));
	for (size_t i = 0; i < n; ++i)
		for (size_t j = 0; j < n; ++j)
			cin >> matrix[i][j];
	//

	for (size_t k = 0; k < n; ++k)
		for (size_t i = 0; i < n; ++i)
			for (size_t j = 0; j < n; ++j)
				matrix[i][j] = _Min_value(matrix[i][j], matrix[i][k] + matrix[k][j]);
}

void read_data(const string& file_name)
{
	size_t n, e;
	ifstream in(file_name);
	in >> n >> e;
	outgoingEdges = vector<vector<pair<size_t, size_t>>>(n);
	for (size_t i = 0; i < e; ++i)
	{
		size_t v, u, d;
		in >> v >> u >> d;
		outgoingEdges[v].push_back({ u, d });
		//outgoingEdges[u].push_back({ v, d });
	}
}

void task_1()
{
	vector<vector<size_t>> to_fixed_objects;
	vector<vector<size_t>> from_fixed_objects;
	// 1a
	for (size_t object : fixed_objects)
		from_fixed_objects.push_back(dijkstra(object));

	for (size_t object : no_fixed_objects)
		to_fixed_objects.push_back(dijkstra(object));

	vector<vector<size_t>> to_from(fixed_objects.size(), vector<size_t>(no_fixed_objects.size()));

	for (size_t i = 0; i < fixed_objects.size(); ++i)
		for (size_t j = 0; j < no_fixed_objects.size(); ++j)
			to_from[i][j] = to_fixed_objects[no_fixed_objects[j]][fixed_objects[i]] + from_fixed_objects[fixed_objects[i]][no_fixed_objects[j]];
	// 1b
	size_t max_dist = 1234567;

	vector<size_t> nearest_objects_to;
	for (size_t i = 0; i < fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, to_fixed_objects[object][fixed_objects[i]]);
		if (max < max_dist)
			nearest_objects_to.push_back(fixed_objects[i]);
	}

	vector<size_t> nearest_objects_from;
	for (size_t i = 0; i < from_fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, from_fixed_objects[i][object]);
		if (max < max_dist)
			nearest_objects_from.push_back(fixed_objects[i]);
	}

	vector<size_t> nearest_objects_to_from;
	for (size_t i = 0; i < to_from.size(); ++i)
	{
		size_t max = 0;
		for (size_t dist : to_from[i])
			max = _Max_value(max, dist);
		if (max < max_dist)
			nearest_objects_to_from.push_back(fixed_objects[i]);
	}
	// 2
	size_t min_to = infinty;
	size_t index_to = 0;
	for (size_t i = 0; i < fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, to_fixed_objects[object][fixed_objects[i]]);
		if (max < min_to)
		{
			min_to = max;
			index_to = fixed_objects[i];
		}
	}

	size_t min_from = infinty;
	size_t index_from = 0;
	for (size_t i = 0; i < from_fixed_objects.size(); ++i)
	{
		size_t max = 0;
		for (size_t object : no_fixed_objects)
			max = _Max_value(max, from_fixed_objects[i][object]);
		if (max < min_from)
		{
			min_from = max;
			index_from = fixed_objects[i];
		}
	}

	size_t min_to_from = infinty;
	size_t index_to_from = 0;
	for (size_t i = 0; i < to_from.size(); ++i)
	{
		size_t max = 0;
		for (size_t dist : to_from[i])
			max = _Max_value(max, dist);
		if (max < min_to_from)
		{
			min_to_from = max;
			index_to_from = fixed_objects[i];
		}
	}
	// 3
	size_t min = infinty;
	size_t index = 0;
	for (size_t i = 0; i < from_fixed_objects.size(); ++i)
	{
		size_t sum = 0;
		for (size_t object : no_fixed_objects)
			sum += from_fixed_objects[i][object];
		if (sum < min)
		{
			min = sum;
			index = fixed_objects[i];
		}
	}
	// 4 - too hard now, do later
}

pair<double, double> coord(size_t v)
{
	return pair<double, double>(0, 0);
}

pair<double, double> operator*(pair<double, double> l, pair<double, double> r)
{
	return pair<double, double>(l.first * r.first, l.second * r.second);
}
pair<double, double> operator+(pair<double, double> l, pair<double, double> r)
{
	return pair<double, double>(l.first + r.first, l.second + r.second);
}
pair<double, double> operator/(pair<double, double> p, double d)
{
	return pair<double, double>(p.first / d, p.second / d);
}
pair<double, double> operator*(pair<double, double> p, double d)
{
	return pair<double, double>(p.first * d, p.second * d);
}
double dist(pair<double, double> l, pair<double, double> r)
{
	return (l.first - r.first) * (l.first - r.first) + (l.second - r.second) * (l.second - r.second);
}

pair<size_t, size_t> nearest_clusters(const vector<pair<double, double>>& centroides)
{
	double min = std::numeric_limits<double>::max();
	pair<size_t, size_t> res;
	for (size_t i = 0; i < centroides.size(); ++i)
		for (size_t j = i + 1; j < centroides.size(); ++j)
		{
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

vector<vector<size_t>> clustering(size_t k)
{
	vector<vector<size_t>> clusters(no_fixed_objects.size(), vector<size_t>(1));
	vector<pair<double, double>> centroides(no_fixed_objects.size());

	for (size_t i = 0; i < no_fixed_objects.size(); ++i)
	{
		clusters[i][0] = no_fixed_objects[i];
		centroides[i] = coord(no_fixed_objects[i]);
	}

	while (clusters.size() > k)
	{
		auto pair = nearest_clusters(centroides);
		centroides[pair.first] = (centroides[pair.first] * clusters[pair.first].size() +
			centroides[pair.second] * clusters[pair.second].size()) / (clusters[pair.first].size() + clusters[pair.second].size());

		for (auto node : clusters[pair.second])
			clusters[pair.first].push_back(node);

		clusters.erase(clusters.begin() + pair.second);
	}
	return clusters;
}

void task_2()
{
	size_t obj = fixed_objects.front();
	auto distance = dijkstra(obj);
}

int main()
{
	string file_name = "file_name";
	read_data(file_name);
}